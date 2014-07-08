ISSAD::Application.routes.draw do

  root to: 'main#home', via: :get
  
  match 'authenticate', to: 'main#authenticate', via: :get, as: :authenticate
  devise_for :users, :path_names => { :sign_in => 'login', :sign_out => 'logout' }, :controllers => {sessions: 'sessions'}
  devise_scope :user do
    get "sign_out", :to => "devise/sessions#destroy"
  end
  
  match 'upload', to: 'upload#fileupload', via: :post, as: :fileupload
  
  match '/maps/mine', to: 'maps#mine', via: :get, as: :mine
  match '/maps/recent', to: 'maps#recent', via: :get, as: :recent
  resources :maps, :constraints => {:format => /(json)/}
  resources :topics, :constraints => {:format => /(json)/}
  resources :synapses, :constraints => {:format => /(json)/}
  resources :mappings, :constraints => {:format => /(json)/}
  resources :metacodes, :constraints => {:format => /(json)/}
  
end
