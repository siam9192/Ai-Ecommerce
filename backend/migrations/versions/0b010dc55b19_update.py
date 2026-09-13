"""update

Revision ID: 0b010dc55b19
Revises: 
Create Date: 2026-09-11 21:12:39.507743

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0b010dc55b19'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("reviews", recreate="always") as batch_op:
        batch_op.alter_column(
            "rating",
            existing_type=sa.INTEGER(),
            type_=sa.Float(),
            existing_nullable=False,
        )
        batch_op.drop_column("is_verified")


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("reviews", recreate="always") as batch_op:
        batch_op.add_column(sa.Column("is_verified", sa.BOOLEAN(), nullable=True))
        batch_op.alter_column(
            "rating",
            existing_type=sa.Float(),
            type_=sa.INTEGER(),
            existing_nullable=False,
        )
