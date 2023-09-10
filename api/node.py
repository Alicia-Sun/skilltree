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
        metaphor = Metaphor("020a82a4-0da1-4257-b958-19c6e3d59266") 
        response = metaphor.search(
            "Learn " + self.node_topic + "for" + self.topic,
            num_results=10,
            use_autoprompt=True,
            type="keyword",
        )
        contents_response = response.get_contents()
        
        links = []

        # Print content for each result               
        for content in contents_response.contents:
            links.append({
                "title": content.title,
                "extract": content.extract,
                "url": content.url,
            })

        self.links = links
