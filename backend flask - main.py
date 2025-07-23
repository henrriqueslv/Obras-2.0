from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

app = Flask(**name**)
app.config[‘SECRET_KEY’] = os.environ.get(‘SECRET_KEY’, ‘dev-secret-key-change-in-production’)
app.config[‘SQLALCHEMY_DATABASE_URI’] = os.environ.get(‘DATABASE_URL’, ‘sqlite:///plataforma_obras.db’)
app.config[‘SQLALCHEMY_TRACK_MODIFICATIONS’] = False

db = SQLAlchemy(app)
CORS(app)

# Models

class User(db.Model):
id = db.Column(db.Integer, primary_key=True)
name = db.Column(db.String(100), nullable=False)
email = db.Column(db.String(120), unique=True, nullable=False)
password_hash = db.Column(db.String(200), nullable=False)
phone = db.Column(db.String(20), nullable=False)
user_type = db.Column(db.String(20), nullable=False)  # ‘client’ or ‘provider’
description = db.Column(db.Text)
website = db.Column(db.String(200))
instagram = db.Column(db.String(100))
created_at = db.Column(db.DateTime, default=datetime.utcnow)
last_login = db.Column(db.DateTime)

```
projects = db.relationship('Project', foreign_keys='Project.client_id', backref='client', lazy=True)
accepted_projects = db.relationship('Project', foreign_keys='Project.provider_id', backref='provider', lazy=True)
quotes = db.relationship('Quote', backref='provider', lazy=True)
reviews_given = db.relationship('Review', foreign_keys='Review.reviewer_id', backref='reviewer', lazy=True)
reviews_received = db.relationship('Review', foreign_keys='Review.reviewed_id', backref='reviewed', lazy=True)

def set_password(self, password):
    self.password_hash = generate_password_hash(password)

def check_password(self, password):
    return check_password_hash(self.password_hash, password)

def get_average_rating(self):
    if not self.reviews_received:
        return 0
    return sum(review.rating for review in self.reviews_received) / len(self.reviews_received)

def to_dict(self):
    return {
        'id': self.id,
        'name': self.name,
        'email': self.email,
        'phone': self.phone,
        'user_type': self.user_type,
        'description': self.description,
        'website': self.website,
        'instagram': self.instagram,
        'average_rating': round(self.get_average_rating(), 1),
        'total_reviews': len(self.reviews_received),
        'created_at': self.created_at.isoformat()
    }
```

class Project(db.Model):
id = db.Column(db.Integer, primary_key=True)
title = db.Column(db.String(200), nullable=False)
description = db.Column(db.Text, nullable=False)
category = db.Column(db.String(50), nullable=False)
location = db.Column(db.String(200), nullable=False)
budget_min = db.Column(db.Float)
budget_max = db.Column(db.Float)
status = db.Column(db.String(20), default=‘open’)  # ‘open’, ‘in_progress’, ‘completed’
client_id = db.Column(db.Integer, db.ForeignKey(‘user.id’), nullable=False)
provider_id = db.Column(db.Integer, db.ForeignKey(‘user.id’))
created_at = db.Column(db.DateTime, default=datetime.utcnow)
updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

```
quotes = db.relationship('Quote', backref='project', lazy=True, cascade='all, delete-orphan')
reviews = db.relationship('Review', backref='project', lazy=True)

def to_dict(self):
    return {
        'id': self.id,
        'title': self.title,
        'description': self.description,
        'category': self.category,
        'location': self.location,
        'budget_min': self.budget_min,
        'budget_max': self.budget_max,
        'status': self.status,
        'client_id': self.client_id,
        'client_name': self.client.name,
        'provider_id': self.provider_id,
        'provider_name': self.provider.name if self.provider else None,
        'created_at': self.created_at.isoformat(),
        'quotes_count': len(self.quotes)
    }
```

class Quote(db.Model):
id = db.Column(db.Integer, primary_key=True)
price = db.Column(db.Float, nullable=False)
description = db.Column(db.Text, nullable=False)
estimated_duration = db.Column(db.String(100))
project_id = db.Column(db.Integer, db.ForeignKey(‘project.id’), nullable=False)
provider_id = db.Column(db.Integer, db.ForeignKey(‘user.id’), nullable=False)
is_accepted = db.Column(db.Boolean, default=False)
created_at = db.Column(db.DateTime, default=datetime.utcnow)

```
def to_dict(self):
    return {
        'id': self.id,
        'price': self.price,
        'description': self.description,
        'estimated_duration': self.estimated_duration,
        'project_id': self.project_id,
        'project_title': self.project.title,
        'provider_id': self.provider_id,
        'provider_name': self.provider.name,
        'provider_rating': round(self.provider.get_average_rating(), 1),
        'is_accepted': self.is_accepted,
        'created_at': self.created_at.isoformat()
    }
```

class Review(db.Model):
id = db.Column(db.Integer, primary_key=True)
rating = db.Column(db.Integer, nullable=False)  # 1-5
comment = db.Column(db.Text)
reviewer_id = db.Column(db.Integer, db.ForeignKey(‘user.id’), nullable=False)
reviewed_id = db.Column(db.Integer, db.ForeignKey(‘user.id’), nullable=False)
project_id = db.Column(db.Integer, db.ForeignKey(‘project.id’), nullable=False)
created_at = db.Column(db.DateTime, default=datetime.utcnow)

```
def to_dict(self):
    return {
        'id': self.id,
        'rating': self.rating,
        'comment': self.comment,
        'reviewer_name': self.reviewer.name,
        'reviewed_name': self.reviewed.name,
        'project_title': self.project.title,
        'created_at': self.created_at.isoformat()
    }
```

# JWT Token decorator

def token_required(f):
@wraps(f)
def decorated(*args, **kwargs):
token = request.headers.get(‘Authorization’)
if not token:
return jsonify({‘message’: ‘Token is missing’}), 401

```
    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = User.query.get(data['user_id'])
    except:
        return jsonify({'message': 'Token is invalid'}), 401
    
    return f(current_user, *args, **kwargs)
return decorated
```

# Auth Routes

@app.route(’/api/auth/register’, methods=[‘POST’])
def register():
data = request.get_json()

```
if User.query.filter_by(email=data['email']).first():
    return jsonify({'message': 'Email already exists'}), 400

user = User(
    name=data['name'],
    email=data['email'],
    phone=data['phone'],
    user_type=data['user_type'],
    description=data.get('description', ''),
    website=data.get('website', ''),
    instagram=data.get('instagram', '')
)
user.set_password(data['password'])

db.session.add(user)
db.session.commit()

token = jwt.encode({
    'user_id': user.id,
    'exp': datetime.utcnow() + timedelta(days=7)
}, app.config['SECRET_KEY'])

return jsonify({
    'token': token,
    'user': user.to_dict()
}), 201
```

@app.route(’/api/auth/login’, methods=[‘POST’])
def login():
data = request.get_json()
user = User.query.filter_by(email=data[‘email’]).first()

```
if user and user.check_password(data['password']):
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

return jsonify({'message': 'Invalid credentials'}), 401
```

@app.route(’/api/auth/me’, methods=[‘GET’])
@token_required
def get_current_user(current_user):
return jsonify({‘user’: current_user.to_dict()})

# Projects Routes

@app.route(’/api/projects’, methods=[‘GET’])
@token_required
def get_projects(current_user):
if current_user.user_type == ‘client’:
projects = Project.query.filter_by(client_id=current_user.id).all()
else:
projects = Project.query.filter_by(status=‘open’).all()

```
return jsonify({'projects': [p.to_dict() for p in projects]})
```

@app.route(’/api/projects’, methods=[‘POST’])
@token_required
def create_project(current_user):
if current_user.user_type != ‘client’:
return jsonify({‘message’: ‘Only clients can create projects’}), 403

```
data = request.get_json()
project = Project(
    title=data['title'],
    description=data['description'],
    category=data['category'],
    location=data['location'],
    budget_min=data.get('budget_min'),
    budget_max=data.get('budget_max'),
    client_id=current_user.id
)

db.session.add(project)
db.session.commit()

return jsonify({'project': project.to_dict()}), 201
```

@app.route(’/api/projects/<int:project_id>/quotes’, methods=[‘GET’])
@token_required
def get_project_quotes(current_user, project_id):
project = Project.query.get_or_404(project_id)

```
if current_user.user_type == 'client' and project.client_id != current_user.id:
    return jsonify({'message': 'Access denied'}), 403

quotes = Quote.query.filter_by(project_id=project_id).all()
return jsonify({'quotes': [q.to_dict() for q in quotes]})
```

# Quotes Routes

@app.route(’/api/quotes’, methods=[‘POST’])
@token_required
def create_quote(current_user):
if current_user.user_type != ‘provider’:
return jsonify({‘message’: ‘Only providers can create quotes’}), 403

```
data = request.get_json()

# Check if provider already quoted this project
existing_quote = Quote.query.filter_by(
    project_id=data['project_id'],
    provider_id=current_user.id
).first()

if existing_quote:
    return jsonify({'message': 'You already quoted this project'}), 400

quote = Quote(
    price=data['price'],
    description=data['description'],
    estimated_duration=data.get('estimated_duration', ''),
    project_id=data['project_id'],
    provider_id=current_user.id
)

db.session.add(quote)
db.session.commit()

return jsonify({'quote': quote.to_dict()}), 201
```

@app.route(’/api/quotes/<int:quote_id>/accept’, methods=[‘POST’])
@token_required
def accept_quote(current_user, quote_id):
quote = Quote.query.get_or_404(quote_id)
project = quote.project

```
if current_user.id != project.client_id:
    return jsonify({'message': 'Access denied'}), 403

quote.is_accepted = True
project.status = 'in_progress'
project.provider_id = quote.provider_id

db.session.commit()

return jsonify({'message': 'Quote accepted successfully'})
```

@app.route(’/api/quotes/my-quotes’, methods=[‘GET’])
@token_required
def get_my_quotes(current_user):
if current_user.user_type != ‘provider’:
return jsonify({‘message’: ‘Only providers can view their quotes’}), 403

```
quotes = Quote.query.filter_by(provider_id=current_user.id).all()
return jsonify({'quotes': [q.to_dict() for q in quotes]})
```

# Users Routes

@app.route(’/api/users/providers’, methods=[‘GET’])
@token_required
def get_providers(current_user):
providers = User.query.filter_by(user_type=‘provider’).all()
return jsonify({‘providers’: [p.to_dict() for p in providers]})

# Reviews Routes

@app.route(’/api/reviews’, methods=[‘POST’])
@token_required
def create_review(current_user):
data = request.get_json()
project = Project.query.get_or_404(data[‘project_id’])

```
# Check if user can review this project
if project.status != 'completed':
    return jsonify({'message': 'Project must be completed to review'}), 400

if current_user.id not in [project.client_id, project.provider_id]:
    return jsonify({'message': 'Access denied'}), 403

# Determine who is being reviewed
reviewed_id = project.provider_id if current_user.id == project.client_id else project.client_id

# Check if review already exists
existing_review = Review.query.filter_by(
    reviewer_id=current_user.id,
    reviewed_id=reviewed_id,
    project_id=project.id
).first()

if existing_review:
    return jsonify({'message': 'You already reviewed this project'}), 400

review = Review(
    rating=data['rating'],
    comment=data.get('comment', ''),
    reviewer_id=current_user.id,
    reviewed_id=reviewed_id,
    project_id=project.id
)

db.session.add(review)
db.session.commit()

return jsonify({'review': review.to_dict()}), 201
```

@app.route(’/api/projects/<int:project_id>/complete’, methods=[‘POST’])
@token_required
def complete_project(current_user, project_id):
project = Project.query.get_or_404(project_id)

```
if current_user.id not in [project.client_id, project.provider_id]:
    return jsonify({'message': 'Access denied'}), 403

project.status = 'completed'
db.session.commit()

return jsonify({'message': 'Project marked as completed'})
```

# Initialize database

@app.before_first_request
def create_tables():
db.create_all()

if **name** == ‘**main**’:
with app.app_context():
db.create_all()
app.run(debug=True, host=‘0.0.0.0’, port=int(os.environ.get(‘PORT’, 5000)))