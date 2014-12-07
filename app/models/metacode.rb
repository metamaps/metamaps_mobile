class Metacode < ActiveRecord::Base

  has_many :topics
  has_many :in_metacode_sets
  has_many :metacode_sets, :through => :in_metacode_sets 

  def hasSelected(user)
    return true if user.settings.metacodes.include? self.id.to_s
    return false
  end

end
