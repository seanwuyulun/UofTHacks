import operator
import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1
from watson_developer_cloud.natural_language_understanding_v1 \
  import Features, EntitiesOptions, KeywordsOptions

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
print(strongest[0])









