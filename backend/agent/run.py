import argparse

from langchain.agents import create_agent
from langchain_core.messages import HumanMessage, AIMessage

from agent.main import llm
from agent.tools import AI_TOOLS
from constant import SYSTEM_PROMPT
from schemas.ai import ChatHistory, ClientState
from schemas.response import AIFinalResponse
from schemas.utils import AuthUser

agent = create_agent(model=llm, tools=AI_TOOLS, system_prompt=SYSTEM_PROMPT)


def ask(
    message: str,
    client_state: ClientState,
    chat_history: list[ChatHistory],
    current_user: AuthUser,
) -> AIFinalResponse:
    history_messages = [
        HumanMessage(content=item.content)
        if item.role == "user"
        else AIMessage(content=item.content)
        for item in chat_history
    ]
    application_state = HumanMessage(
        content=(
            "Application state:\n"
            f"current-path: {client_state.current_path}\n"
            f"featured-product-ids: {client_state.featured_product_ids}\n"
            f"shop-product-ids: {client_state.shop_product_ids}\n"
            f"order-ids: {client_state.order_ids}\n"
            f"customer-ids: {client_state.customer_ids}\n"
            f"is_authenticated: yes\n"
            f"user-id: {current_user.id}\n"
            f"user-role: {current_user.role}"
        )
    )
    result = agent.invoke({
        "messages": [*history_messages, application_state, HumanMessage(content=message)]
    })

    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage):
            for tool_call in msg.tool_calls:
                if tool_call["name"] == "final_response":
                    return AIFinalResponse.model_validate(
                        tool_call["args"]["response"]
                    )

    raise RuntimeError("final_response tool was not called")
