import datetime

JWT_SECRET_KEY = 'jwt_secret_key'
JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=1)

DB_HOST = 'localhost'
DB_PORT = 3306
DB_USER = 'ygoons_test'  # Should definitely not use root
DB_PASSWORD = 'Public1!'
DB_NAME = 'ygoons_test'

SONG_STORAGE_PATH = '../../storage/song_storage'
CLIP_STORAGE_PATH = '../../storage/clip_storage'
IMAGE_STORAGE_PATH = '../../storage/image_storage'

S3_KEY = 'S3_DUMMY_ACCESS_KEY'
S3_SECRET = 'S3_DUMMY_SECRET_KEY'
