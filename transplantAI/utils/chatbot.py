from chatbot_diagnostics import HAMD_post,HAMD_pre, PHQ9, json_loader

path_to_questionnaires = '../../models/ai_chatbot/questionnaires/'
questionnaire_loader = lambda name: json_loader(path_to_questionnaires, name)
index = questionnaire_loader("index.json")

print ("\nHello, I am a chatbot.")
# PHQ9(filename = "phq-9.json")
option=int(input("Enter 1 for pre transplant assessment, and 2 for post transplant assessment:"))
if(option!=1 and option!=2):
    print("Invalid option")
elif(option==1):
    print("Let's assess your pre transplant mental health...")
    HAMD_pre()
    print ("\nThank you for your responses.")
else:
    print("Let's assess your post transplant mental health...")
    HAMD_post()
    print ("\nThank you for your responses.")
    


# general support services to recommend after survey is complete
try:
    print("\nIf you are in need of immediate support, please consider services like the following:\n")
    with open("data/services.txt", "r") as file:
        for line in file.read().split("\n"):
            print(line.strip())
except Exception as e:
    print("File Not Found!")



    
