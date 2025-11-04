#!/bin/bash

echo "🔹 Starting Backend..."
cd backend || exit
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install django-seed
python manage.py makemigrations
python manage.py migrate

echo "🟢 Creating superuser (admin)..."
python manage.py shell -c "from user.models import UserAccount; UserAccount.objects.filter(phone_number='01611111111').exists() or UserAccount.objects.create_superuser('01611111111', '12345')"

python manage.py runserver 5174 &
BACKEND_PID=$!

echo "🔹 Starting Frontend..."
cd ../frontend || exit
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Backend (PID: $BACKEND_PID) and Frontend (PID: $FRONTEND_PID) running..."

wait

# chmod +x run.sh 
# ./run.sh
