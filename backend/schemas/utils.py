from pydantic import BaseModel,Field 
from typing import Optional
class PaginationQuery (BaseModel):
    limit:Optional[int] = Field (default=10,description="Data limit")
    page:Optional[int] = Field (default=1,description="Data limit")
    sort_by:Optional[str] = Field (default="asc",description="Must be asc or desc")
    sort_field:Optional[str] = Field(default="Sort field name")
    
    
    
    
    