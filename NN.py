'''Additions: Inputs from Google Home APi talked about in other comments'''
#In terms of the keys of dict_of_rating, they are indices correlating what number question it is. Value = the value you want to change
chosen_activity = '' #the activity the user choses
likes_an_activity = True #default assumption is the user picks an activity
vary_weight = [] #weighting of each question starts out at 1(refere to starting_weight(n))
def starting_weight(n):
    for i in range(n):
        vary_weight.append(1)
def max_weight_score():
    #use to find the highest possible score a single activity could get 
    maximum = 0
    for weight in vary_weight:
        maximum += weight
    return maximum 
def customization_of_weighting(dict_of_rating: Dict[int, int]):
    #dict_of_rating is a dictionary where keys are the index number associated with the current question
    #values pertain to the new rating you want to use. 
    for index in dict_of_rating:
        vary_weight[index] = dict_of_rating[index]
def calc_weight(dict_of_a: Dict[int, List[int]]):
    #dict_a represents a dictionary of activities(the keys) and the list the rating/scores of each question
    #you can set this score to be 1 if you want(or optimize it if you want :D)
    #dict_a will be acheived through interaction with the google home api
    #Final note: returns a dictionary where keys are activies and their value is a single integer representing its score 
    dict_tot_rating = {}
    for activity in dict_of_a:
        for i in range(len(activity)):
            dict_tot_rating[activity] = activity[i] * vary_weight[i]
    return dict_tot_rating
def rank_activities(dict_tot_rating):
    #simple ranks the best activies based on their score and puts them in an ordered list
    rank_list = []
    for activity in dict_tot_rating:
        if len(rank_list) == 0:
            rank_list = [activity]
        else:
            j = len(rank_list) - 1
            while j != 0 and rank_list[j] < dict_tot_rating[activity]:
                activity, rank_list[j] = rank_list[j], activity 
                j -= 1
    return rank_list
                
def conclude_best_activity(user_likes: bool, rank_list, user_name, dict_tot_rating) -> str:
    #May be subject to change, but this is the general code to figure out which event the user wants after all the calculations
    #It also let's the user know how much the program is sure that the guess is correct 
    #If the user likes none of the activies just realease all of them so they can still have them to pick and choose from
    j = len(rank_list) - 1
    maximum = max_weight_score
    while not user_likes and j != 0:
        print("%s do you like this activity: %s" % (user_name, ranklist[j]))
        user_likes = input()#place holder code to utilize Google Home's speech input
        j -= 1
        #code for user_likes boolean value
        if user_likes:
            chosen_activity = rank_list[j]
            display = rank_list[j] + " " + str((dict_tot_rating[rank_list[j]]//maximum())*100) + "% preference"
            return display 
    likes_an_activity = False 
    print("We could not find an activity that you liked")
    print("Therefore, here is a list of activities near you with their associated scores(based on your answers to my questions")
    for activity in rank_list:
        percent = (dict_tot_rating[rank_list[i]]//maximum())*100
        print("%s - %s preference" %(activity, percent))
    #not sure if you want this empty return statement, just wanted to keep the type contract consistent 
    return ''
def learning_from_noise(rank_list, dict_of_a):
    #Simple Learning Model for the program- based on the rank of the attribute, the 
    if likes_an_activity:
        rank_a = []
        for i in range(len(dict_of_a[chosen_activity])):
            if len(rank_a) == 0:
                rank_a = i
            else:
                j = len(rank_a) - 1
                while j != 0 and dict_of_a[chosen_activity][j] < dict_of_a[chosen_activity][i]:
                    i, rank_a[j] = rank_a[j], i 
                    j -= 1    
        for k in range(len(vary_weight)):
            changing_index = rank_a.getIndex(k)
            vary_weight[k] += (rank_a.length() - changing_index)
        
        
