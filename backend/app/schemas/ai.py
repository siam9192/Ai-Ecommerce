from pydantic import BaseModel, Field
from typing import Literal, Optional


class ClientState (BaseModel):
    current_path: str = "/"
    featured_product_ids: list[int] = Field(default_factory=list)
    shop_product_ids: list[int] = Field(default_factory=list)
    order_ids: list[int] = Field(default_factory=list)
    customer_ids: list[int] = Field(default_factory=list)


class ChatHistory(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class AIAskPayload(BaseModel):
    message: str = Field(min_length=1)
    client_state: Optional[ClientState] = Field(default=None)
    chat_history: Optional[list[ChatHistory]] = Field(default_factory=list)
