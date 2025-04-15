from typing import List, Optional
from passlib.context import CryptContext

from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, user_create: UserCreate) -> User:
        hashed_password = pwd_context.hash(user_create.password)
        return self.user_repository.create(user_create, hashed_password)

    def list_users(
        self,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[User]:
        return self.user_repository.get_all(
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active
        )

    def get_user(self, user_id: int) -> Optional[User]:
        return self.user_repository.get_by_id(user_id)

    def delete_user(self, user_id: int) -> bool:
        return self.user_repository.delete(user_id)
