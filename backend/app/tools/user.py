from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.users import User, UserRole
from app.schemas.users import ToolFindUsersPayload, ToolUpdateUserPayload
from app.services.users import _user_response


class UserTools:
    @staticmethod
    def find_users(payload: ToolFindUsersPayload, db: Session):
        query = db.query(User).filter(
            User.is_deleted.is_(False),
            User.role == UserRole.CUSTOMER,
        )
        if payload.email is not None:
            query = query.filter(User.email == str(payload.email).lower())
        if payload.status is not None:
            query = query.filter(User.status == payload.status)
        if payload.search is not None:
            search_term = payload.search.strip()
            if search_term:
                pattern = f"%{search_term}%"
                query = query.filter(
                    or_(
                        User.full_name.ilike(pattern),
                        User.email.ilike(pattern),
                    )
                )

        total = query.count()
        users = (
            query.order_by(User.created_at.desc())
            .limit(payload.limit)
            .all()
        )
        return {
            "success": True,
            "message": "Customer accounts retrieved successfully",
            "data": [_user_response(user) for user in users],
            "total": total,
        }

    @staticmethod
    def get_user(user_id: int, db: Session):
        user = (
            db.query(User)
            .filter(
                User.id == user_id,
                User.role == UserRole.CUSTOMER,
                User.is_deleted.is_(False),
            )
            .first()
        )
        if user is None:
            return {
                "success": False,
                "message": "Customer account not found",
                "data": None,
            }
        return {
            "success": True,
            "message": "Customer account retrieved successfully",
            "data": _user_response(user),
        }

    @staticmethod
    def update_user(
        user_id: int,
        payload: ToolUpdateUserPayload,
        db: Session,
    ):
        user = (
            db.query(User)
            .filter(
                User.id == user_id,
                User.role == UserRole.CUSTOMER,
                User.is_deleted.is_(False),
            )
            .first()
        )
        if user is None:
            return {
                "success": False,
                "message": "Customer account not found",
                "data": None,
            }

        updates = payload.model_dump(exclude_unset=True, exclude_none=True)
        if not updates:
            return {
                "success": False,
                "message": "Provide an email, name, or account status to update",
                "data": None,
            }

        full_name = None
        if "full_name" in updates:
            full_name = updates["full_name"].strip()
            if not full_name:
                return {
                    "success": False,
                    "message": "Name cannot be blank",
                    "data": None,
                }

        if "email" in updates:
            email = str(updates["email"]).lower()
            duplicate = (
                db.query(User)
                .filter(User.email == email, User.id != user_id)
                .first()
            )
            if duplicate is not None:
                return {
                    "success": False,
                    "message": "Email is already registered",
                    "data": None,
                }
            user.email = email

        if full_name is not None:
            user.full_name = full_name

        if "status" in updates:
            user.status = updates["status"]

        db.commit()
        db.refresh(user)
        return {
            "success": True,
            "message": "Customer account updated successfully",
            "data": _user_response(user),
        }

    @staticmethod
    def delete_user(user_id: int, db: Session):
        user = (
            db.query(User)
            .filter(
                User.id == user_id,
                User.role == UserRole.CUSTOMER,
                User.is_deleted.is_(False),
            )
            .first()
        )
        if user is None:
            return {
                "success": False,
                "message": "Customer account not found",
                "data": False,
            }
        user.is_deleted = True
        db.commit()
        return {
            "success": True,
            "message": "Customer account deleted successfully",
            "data": True,
        }
