import argparse

from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage

from agent.main import llm
from agent.tools import AI_TOOLS
from constant import SYSTEM_PROMPT
from schemas.response import AIFinalResponse

agent = create_agent(model=llm, tools=AI_TOOLS, system_prompt=SYSTEM_PROMPT)


def ask(message: str) -> AIFinalResponse:
    result = agent.invoke({
        "messages": [HumanMessage(content=message)]
    })

    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage):
            for tool_call in msg.tool_calls:
                if tool_call["name"] == "final_response":
                    return AIFinalResponse.model_validate(
                        tool_call["args"]["response"]
                    )

    raise RuntimeError("final_response tool was not called")
