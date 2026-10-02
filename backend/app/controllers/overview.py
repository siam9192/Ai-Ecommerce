from fastapi import APIRouter,Depends
from app.services.overview import OverviewService
from app.controllers.auth import auth_guard
from app.database import get_db
from app.models.users import UserRole

router = APIRouter(prefix="/overview", tags=["AI"])


@router.get("/admin")
def get_admin_overview(current_user = Depends(auth_guard([UserRole.ADMIN])),db=Depends(get_db)):
    return OverviewService.get_admin_overview(db)


@router.get("/orders")
def get_orders_overview(current_user = Depends(auth_guard([UserRole.ADMIN])),db=Depends(get_db)):
    return OverviewService.get_orders_overview(db)
