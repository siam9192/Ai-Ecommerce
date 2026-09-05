import argparse

from langchain.agents import create_agent
from langchain_core.messages import HumanMessage

from agent.main import llm
from agent.tools import AI_TOOLS
from constant import SYSTEM_PROMPT


agent = create_agent(model=llm, tools=AI_TOOLS, system_prompt=SYSTEM_PROMPT)


def ask(message: str) -> str:
    """Run one user request through the AI and its database tools."""
    result = agent.invoke({"messages": [HumanMessage(content=message)]})
    return result["messages"][-1].content
