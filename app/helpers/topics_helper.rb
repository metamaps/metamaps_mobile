module TopicsHelper

  #find all nodes in any given nodes network
  def network(node, array, count)
	# recurse starting with a node to find all connected nodes and return an array of topics that constitutes the starting nodes network

	# if the array of nodes is empty initialize it
	if array.nil?
		array = Array.new
	end

	# add the node to the array
	array.push(node)

	if count == 0
		return array
	end

	count = count - 1

	# check if each relative is already in the array and if not, call the network function again
	if not node.relatives.empty?
		if (node.relatives-array).empty?
			return array
		else
			(node.relatives-array).each do |relative|	
				array = (array | network(relative, array, count))				
			end
			return array
		end

	elsif node.relatives.empty?
		return array
	end	  
  end
  
end
