import sys
import functools
try:
    hi = list(map(int, list(set(sys.stdin.read().strip().split()))))
    def half(a):
        return a//2
    over = list(filter(lambda x: (x >2147483647 or x<-2147483648), hi))
    if(len(over)>0):
        print("*** NanInt32")
        quit() 
    array   = list(filter(lambda x: (x % 2 == 1), hi))
    array.extend(list(map(half,list(filter(lambda x: (x % 2 == 0), hi)))))
    array = list(set(array))
    print(functools.reduce(lambda a,b : a+b,array))
except Exception as e:
    print("*** "+str(e))