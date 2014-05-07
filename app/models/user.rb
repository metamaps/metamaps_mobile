require 'open-uri'

class User < ActiveRecord::Base

has_many :topics
has_many :synapses
has_many :maps
has_many :mappings

  devise :database_authenticatable, :rememberable, :trackable
  
  attr_accessible :name, :email, :password, :password_confirmation, :code, :joinedwithcode, :remember_me

  serialize :settings, UserPreference
  
  def settings
    # make sure we always return a UserPreference instance
    if read_attribute(:settings).nil?
      write_attribute :settings, UserPreference.new
      read_attribute :settings
    else
      read_attribute :settings
    end
  end
  
  def settings=(val)
    write_attribute :settings, val
  end
end
