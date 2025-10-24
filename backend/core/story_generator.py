from sqlalchemy.orm import Session
from core.config import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from core.prompts import STORY_PROMPT
from models.story import Story, StoryNode
from core.models import StoryLLMResponse, StoryNodeLLM


class StoryGenerator:
    @classmethod
    def _get_llm(cls):
        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GEMINI_API_KEY
        )
    
    @classmethod
    def generate_story(cls, db: Session, session_id: str, theme: str = "fantasy") -> Story:
        print("✅ Step 1: Starting story generation")

        llm = cls._get_llm()
        print("✅ Step 2: LLM initialized")

        story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)
        print("✅ Step 3: Parser created")

        prompt = ChatPromptTemplate.from_messages([
            ("system", STORY_PROMPT),
            ("human", f"create the story with this theme: {theme}")
        ]).partial(format_instructions=story_parser.get_format_instructions())
        print("✅ Step 4: Prompt created")

        raw_response = llm.invoke(prompt.invoke({}))
        print("✅ Step 5: LLM invoked successfully")

        response_text = raw_response
        if hasattr(raw_response, "content"):
            response_text = raw_response.content

        print("🧩 RAW RESPONSE FROM GEMINI:")
        print(response_text)

        story_structure = story_parser.parse(response_text)
        print("✅ Step 6: Parsed story structure successfully")


        story_db = Story(title=story_structure.title, session_id=session_id)

        db.add(story_db)
        db.flush()

        root_node_data = story_structure.rootNode
        if isinstance(root_node_data, dict):
            root_node_data = StoryNodeLLM.model_validate(root_node_data)

        cls._process_stroy_node(db, story_db.id, root_node_data, is_root=True)

        db.commit()
        return story_db
    
    @classmethod
    def _process_stroy_node(cls, db: Session, story_id: int, node_data: StoryNodeLLM, is_root: bool = False) -> StoryNode:
        node = StoryNode(
            story_id=story_id,
            content=node_data.content if hasattr(node_data, "content") else node_data["content"],
            is_root=is_root,
            is_ending=node_data.isEnding if hasattr(node_data, "isEnding") else node_data["isEnding"],
            is_winning_ending=node_data.isWinningEnding if hasattr(node_data, "isWinningEnding") else node_data["isWinningEnding"],
            options=[]
        )

        db.add(node)
        db.flush()

        if not node.is_ending and node_data.options:
            options_list = []
            for option_data in node_data.options:
                next_node = option_data.nextNode

                if isinstance(next_node, dict):
                    next_node = StoryNodeLLM.model_validate(next_node)

                child_node = cls._process_stroy_node(db, story_id, next_node, is_root=False)

                options_list.append({
                    "text": option_data.text,
                    "node_id": child_node.id
                })

            node.options = options_list
        
        db.flush()
        return node


