import openai
import asyncio
import json
from node import Node
from openai_session import OpenAISession

class Graph:
    def __init__(self, topic, knowledge):
        self.topic = topic
        self.knowledge = knowledge
        self.nodes = []
        self.session = OpenAISession()
        openai.api_key = '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'

    def generate_graph(self):
        self.session.add_system_command('Consider what the user is already familiar with and try to productively build upon the knowledge. However, the topics the user knows do not necessarily need to be in the graph. Think step by step. Provide a rigorous roadmap for the user.')
        msg = {"role" : "user",
               "content" : f"I want to learn about {self.topic}. I am already familiar with {self.knowledge}. Please help me generate a curriculum in the form of a directed graph of topics I must learn to master {self.topic}. In the graph, each topic should lead to one to three other topics. Limit the maximum length of a path on the graph to six. Stay focused on the topic of {self.topic}. Think step by step."}
        graph = self.session.execute_function_call(msg, 'create_tree', 3000, 0.1)
        edges = json.loads(graph)
        print(edges)
        msg = {"role" : "user",
               "content" : f"I would like to know more about the following list of education topics: {edges.keys()}. These topics are with respect to {self.topic}. Please create a dictionary where the keys are the topics in the list and the values are descriptions of each topic with respect to {self.topic}."}
        desc = self.session.execute_function_call(msg, 'print_dict', 6000, 0.3)
        desc = json.loads(desc)
        print(desc)
        print("STARTING NOW")
        
        for node in edges.keys():
            new_node = Node(self.topic, node, edges[node], desc[node])
            new_node.generate_links() 
            self.nodes.append(new_node)
            print(new_node.node_topic)
            print(new_node.destinations)
            print(new_node.description)
            print(new_node.links)
            print("DONE WITH ONE")

tester = Graph('Computer Systems', 'transistors, C programming language, trap functions')
tester.generate_graph()
