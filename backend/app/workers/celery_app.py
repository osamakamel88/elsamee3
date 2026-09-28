from celery import Celery
from app.config import settings

celery_app = Celery(
    "elsamee3_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.task_routes = {
    "app.workers.tasks.*": {"queue": "main-queue"}
}
