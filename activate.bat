@echo off
echo ======================================
echo 🔹 Starting Backend Setup and Server...
echo ======================================

:: Go to backend folder
cd backend

:: Check if venv exists, otherwise create it
if not exist venv (
    echo 🟢 Creating virtual environment...
    python -m venv venv
)

:: Activate venv
call venv\Scripts\activate

:: Install dependencies
echo 🟢 Installing requirements...
pip install -r requirements.txt

:: Run migrations
echo 🟢 Running migrations...
python manage.py makemigrations
python manage.py migrate

python manage.py loaddata backend/category/fixtures/categories.json
python manage.py loaddata backend/category/fixtures/subcategories.json
python manage.py loaddata backend/product/fixtures/products.json

python manage.py collectstatic --noinput

:: go.bat
