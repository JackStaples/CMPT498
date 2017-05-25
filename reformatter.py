"""
    Written by Mark Tigchelaar
    Reformats traffic database query results (In their current form)
    Then transforms the date time into a easier to deal with format
"""

def main():
    name = '1007.csv'
    newName = '1007format.csv'

    with open(name, 'r') as File:
        header = newHeader(File.readline())
        makeFile(header, File, newName)
        File.close()

#If you have to ask ...
def newHeader(line):
    return line[:9] + 'Year,Month,Day,Hour,Minute,Second' + line[17:]

#opens the new file up writes to it.
def makeFile(header, File, newName):
    with open(newName, 'w') as newFile:
        newFile.write(header)
        for line in File:
            if line.isspace(): continue
            newFile.write(fmt(line))
    newFile.close()

#Break line into chunks, re format datetime, return as string
def fmt(line):
    line = line.split(',')
    dateData = makeListFromDate(line[1])
    line.pop(1)
    return makeString(line, dateData)

# 2015 09 01 09 39 00.000
def makeListFromDate(date):
    result = list()
    monthes = ['Jan','Feb','Mar','Apl','May','Jne',
               'Jly','Aug','Sep','Oct','Nov','Dec']
    result.append(date[:4])#year
    result.append(monthes[int(date[4:6]) -1])#month
    result.append(date[6:8])#day
    result.append(date[8:10])#hr
    result.append(date[10:12])#min
    result.append(date[12:])#sec
    return result

# Joins list into string
def makeString(line, dateData):
    for i in range(len(dateData)-1, -1, -1):
        line.insert(1, dateData[i])
    string = ''
    for item in line:
        string += item + ','
    return string[:-1]


if __name__ == '__main__':
    main()
