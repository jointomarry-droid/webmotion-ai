from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_ai_endpoint():
    return {
        'status': 'ok',
        'message': 'AI API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_ai_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'ai'
    }
