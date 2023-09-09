import asyncio
from metaphor_python import Metaphor

class Node:
    def __init__(self, topic, node_topic, destinations, desc):
        self.topic = topic
        self.node_topic = node_topic
        self.destinations = destinations
        self.description = desc
        self.links = []
        
    def generate_links(self):
        metaphor = Metaphor("b74b5b72-e2d0-44d5-ac08-ffb5c598c3e1") 
        response = metaphor.search(
            "Learn " + self.node_topic + "for" + self.topic,
            num_results=5,
            use_autoprompt=True,
            type="keyword",
        )
        contents_response = response.get_contents()
        
        links = []

        # Print content for each result               
        for content in contents_response.contents:
            links.append(content.url)

        self.links = links
