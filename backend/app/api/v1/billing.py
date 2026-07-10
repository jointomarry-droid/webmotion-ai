from fastapi import APIRouter

router = APIRouter()

@router.get('/')
async def get_billing_endpoint():
    return {
        'status': 'ok',
        'message': 'Billing API endpoint working',
        'version': '0.1.0'
    }

@router.get('/health')
async def health_check_billing_endpoint():
    return {
        'status': 'healthy',
        'endpoint': 'billing'
    }
