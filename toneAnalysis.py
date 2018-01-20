import operator
import json
import random
import requests
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
  import Features, EntitiesOptions, KeywordsOptions, CategoriesOptions

natural_language_understanding = NaturalLanguageUnderstandingV1(
  username='66c3b439-9b57-48fe-9c53-e5b82d4289f5',
  password='o0zSfj5pkdzs',
  version='2017-02-27')

response = natural_language_understanding.analyze(
  text='ok google you retard',
  features=Features(
    entities=EntitiesOptions(
      emotion=True,
      sentiment=True,
      limit=2),
    keywords=KeywordsOptions(
      emotion=True,
      sentiment=True,
      limit=2)))

#print(json.dumps(response["keywords"][0]["emotion"]))
meme = response["keywords"][0]["emotion"]
sorted_meme = sorted(meme.items(), key=operator.itemgetter(1))
#print(sorted_meme)
#sadness, joy, fear, disgust, anger
strongest = sorted_meme[-1]
print(str(strongest[0]))

related_activities = []

if (strongest[0] == "sadness"):
    related_activities = ["food", "sleep", "proofs"]
elif (strongest[0] == "joy"):
    related_activities = ["music", "drugs", "linear algebra"]
elif (strongest[0] == "fear"):
    related_activities = ["fries", "ice cream", "analysis"]
elif (strongest[0] == "disgust"):
    related_activities = ["gym", "annex Ukraine", "topology"]
elif (strongest[0] == "anger"):
    related_activities = ["meditate", "punch google home", "non-commutative C* Algebra in non P-addic space"]
else:
    related_activities = ["die"]
    
print(related_activities)

urlList = []
for topic in related_activities:
    url = ('https://newsapi.org/v2/everything?'
                   'q='+topic+''
                   '&apiKey=e68789c2b4ac4232b4ac88b966b17295')
    response = requests.get(url).json()
    #print(response)
            
    responseArticles = response['articles'][0]['url']
    urlList.append(responseArticles)
   
taskList = []
for j in urlList: 
    response = natural_language_understanding.analyze(
            url=''+j+'',
            features=Features(
                    categories=CategoriesOptions()))
    
    taskList.append(response["categories"][0]["label"])

finalList = []
for tasks in taskList:
    cleanList = tasks.split('/')
    finalList.extend(cleanList)

finalList[:] = (value for value in finalList if value != '')

randomChoice = (random.choice(finalList))
print(randomChoice)








