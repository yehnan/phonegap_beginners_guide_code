require 'rubygems'
require 'sinatra'
require 'erb'
require 'json'

@@stories = [
  {
    :time => Time.now.to_i,
    :title => "Outbreak in Europe",
    :body => "There has been a terrifying outbreak in Europe. Be forewarned!"
  }
]

get '/' do
  erb :index, :locals => { :stories => @@stories }
end

post '/story' do
  new_story = {
    :time => Time.now.to_i,
    :title => params[:title],
    :body => params[:body]
  }

  @@stories.unshift new_story

  redirect '/'
end

get '/json' do
  content_type :json
  @@stories[0,5].to_json
end
