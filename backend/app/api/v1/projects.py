from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_projects_endpoint():
    return {
        'status': 'ok',
        'message': 'Projects API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_projects_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'projects'
    }
