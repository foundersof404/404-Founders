use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/google-signup', [AuthController::class, 'googleSignup']);
}); 