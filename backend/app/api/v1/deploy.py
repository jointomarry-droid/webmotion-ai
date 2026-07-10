from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_deploy_endpoint():
    return {
        'status': 'ok',
        'message': 'Deploy API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_deploy_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'deploy'
    }
