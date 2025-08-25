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


:: Create superuser if not exists
echo 🟢 Creating superuser (admin)...
python manage.py shell -c "from user.models import UserAccount; User.objects.filter(phone_number='01611111111').exists() or User.objects.create_superuser('01611111111', 'admin@gmail.com', '12345')"

:: Start backend server
start cmd /k "python manage.py runserver 5174"

:: Go back to root
cd ..

echo ======================================
echo 🔹 Starting Frontend...
echo ======================================

:: Go to frontend folder and start dev server
cd frontend
npm install
start cmd /k "npm run dev"

echo ======================================
echo ✅ Backend and Frontend running...
echo ======================================

:: run.bat
