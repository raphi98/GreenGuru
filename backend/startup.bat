REM Activate the Python environment
call venv_greenguru\Scripts\activate

REM flush data
python wapdev2\manage.py flush

REM flush data
python wapdev2\manage.py makemigrations

REM Run the "example_data" command
python wapdev2\manage.py sample_data

REM Run the Django development server
python wapdev2\manage.py runserver

REM Deactivate the Python environment (optional, depending on your needs)

pause