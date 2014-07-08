require 'open-uri'

class User < ActiveRecord::Base

has_many :topics
has_many :synapses
has_many :maps
has_many :mappings

  devise :database_authenticatable, :rememberable, :trackable
  
  attr_accessible :name, :email, :image, :password, :password_confirmation, :code, :joinedwithcode, :remember_me

  serialize :settings, UserPreference
  
  # This method associates the attribute ":image" with a file attachment
  has_attached_file :image, :styles => {
   :thumb => ['100x100>', :png],
   :square => ['200x200#', :png],
   :round => ['200x200#', :png]
  }
  
  def info
    Hash["user", Hash["name", self.name, "id", self.id, "image", self.image.url]]
  end
  
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
