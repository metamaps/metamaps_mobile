ISSAD::Application.routes.draw do

  root to: 'main#home', via: :get
  
  devise_for :users, :path_names => { :sign_in => 'login', :sign_out => 'logout' }
  devise_scope :user do
    get "sign_out", :to => "devise/sessions#destroy"
  end
  
  resources :maps, :constraints => {:format => /(json)/}
  resources :topics, :constraints => {:format => /(json)/}
  resources :synapses, :constraints => {:format => /(json)/}
  resources :mappings, :constraints => {:format => /(json)/}
  resources :metacodes, :constraints => {:format => /(json)/}
  
end
