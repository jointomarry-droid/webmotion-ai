from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_auth_endpoint():
    return {
        'status': 'ok',
        'message': 'Auth API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_auth_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'auth'
    }
