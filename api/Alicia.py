#pip install
#poetry add

#takes in topic
from metaphor_python import Metaphor

class Node:
    def __init__(self, val = "", neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []


# given a string, topic, returns list of 10 links that are used to learn such topic
def curateLinks(topic):
    metaphor = Metaphor("b74b5b72-e2d0-44d5-ac08-ffb5c598c3e1") 
    response = metaphor.search(
        "Learn " + topic,
        num_results=10,
        use_autoprompt=True,
        type="keyword",
    )
    contents_response = response.get_contents()
    
    links = []

    # Print content for each result               
    for content in contents_response.contents:
        links.append(content.url)

    return links

print(curateLinks("Number Theory"))


# def generateGraph(topic):
