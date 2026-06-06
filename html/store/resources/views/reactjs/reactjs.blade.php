

@extends('reactjs.document')

<?php 
use App\Helpers\View\JS;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Control\Ctrl;

    $server = get($server, []);
    $user= Auth::user();
    if(!$user) $user = (object)[];
    
    $common=[
        'APP_SLOGAN' => APP_SLOGAN,
        'APP_TITLE' => APP_TITLE,
        'APP_DOMAIN' => APP_DOMAIN,
        'APP_AUTHEN' => APP_AUTHEN,
        'APP_UPLOAD' => APP_UPLOAD,
        'APP_ADMIN' => APP_ADMIN,
        'APP_CENTER' => APP_CENTER,
        'APP_NAME' => APP_NAME,
        'APP_LOGO' => Ctrl::get('ctrl_logo', '/store/public/assets/auth/img/logo.png'),
    ];
    
    
   
    echo JS::load($server + [
            'user'=>[
                USER_USERNAME => isset($user->{USER_USERNAME})? $user->{USER_USERNAME}: '',
                USER_EMAIL => isset($user->{USER_EMAIL})? $user->{USER_EMAIL}: '',
                USER_ROLE => isset($user->{USER_ROLE})? $user->{USER_ROLE}: '',
                USER_OFFLINE => isset($user->{USER_OFFLINE})? $user->{USER_OFFLINE}: '',
                USER_POD => isset($user->{USER_POD})? $user->{USER_POD}: '',
            ],
            
            'common' => $common,
            
    ] ,'server');
    
    
?>

@section('body')

<div id="app"></div>

@viteReactRefresh
@vite('resources/react/app.js')

@endsection

@section('footer')

@endsection

