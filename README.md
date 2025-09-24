# ModuERP
Plug-in SME

## Activate Virtual Environment
- In project folder, create a Virtual Environment:
```bash
python -m venv venv
```
- Activate Virtual Environment:
```bash
venv\Scripts\activate
```

## Migrate Database
- Create migartion fils for new app:
```bash
python manage.py makemigrations new_app
```
- Start migartion process:
```bash
python manage.py migrate
```

## Run seeder
```bash
python manage.py seed_inventory
```

## Start Project
- Start project:
```bash
python manage.py runserver
```
- Default URL: ```http://127.0.0.1:8000/```