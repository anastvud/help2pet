from enum import Enum
# from fastapi_mail import FastMail, MessageSchema
# from fastapi_mail import ConnectionConfig
from app.config import settings


class BookingStatus(str, Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"
    pending = "pending"

# mail_conf = ConnectionConfig(
#     MAIL_USERNAME=settings.MAIL_USERNAME,
#     MAIL_PASSWORD=settings.MAIL_PASSWORD,
#     MAIL_FROM=settings.MAIL_FROM,
#     MAIL_PORT=settings.MAIL_PORT,
#     MAIL_SERVER=settings.MAIL_SERVER,
#     MAIL_TLS=settings.MAIL_TLS,
#     MAIL_SSL=settings.MAIL_SSL,
#     USE_CREDENTIALS=True,
#     VALIDATE_CERTS=True
# )


# async def send_booking_confirmation(owner_email: str, sitter_email: str, booking_info: dict):
#     message = MessageSchema(
#         subject="Booking Confirmation",
#         recipients=[owner_email, sitter_email],
#         body=f"""
#         Hello,
#
#         A new booking has been confirmed!
#
#         Booking ID: {booking_info['id']}
#         Time: {booking_info['start_time']} - {booking_info['end_time']}
#         Status: {booking_info['status']}
#
#         Thank you for using our service.
#         """,
#         subtype="plain"
#     )
#
#     fm = FastMail(mail_conf)
#     await fm.send_message(message)