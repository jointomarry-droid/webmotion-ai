from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_templates_endpoint():
    return {
        'status': 'ok',
        'message': 'Templates API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_templates_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'templates'
    }
