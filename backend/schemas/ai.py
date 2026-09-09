from pydantic import BaseModel,Field
from typing import Optional,Literal


class ClientState (BaseModel):
    current_path: str
    featured_product_ids: list[int] | None = None
    shop_product_ids: list[int] | None = None
    order_ids: list[int] | None = None
    customer_ids: list[int] | None = None


class ChatHistory(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class AIAskPayload(BaseModel):
    message: str = Field(min_length=1)
    client_state: ClientState
    chat_history: list[ChatHistory] = Field(default_factory=list)
