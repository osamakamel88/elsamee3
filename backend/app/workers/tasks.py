from .celery_app import celery_app
import time

@celery_app.task
def scan_work_on_platforms(work_id: str):
    # Simulated background task
    time.sleep(5)
    return f"Scan completed for work {work_id}"

@celery_app.task
def scheduled_monitoring_scan():
    return "Scheduled scan completed"

@celery_app.task
def process_fingerprint(work_id: str, file_path: str):
    time.sleep(2)
    return f"Fingerprint processed for {work_id}"
