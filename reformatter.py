
def main():
    name = 'Combined.csv'
    newName = 'CombinedDTformat.csv'

    with open(name, 'r') as File:

        makeFile(File, newName)
        File.close()


#opens the new file up writes to it.
def makeFile(File, newName):
    header = File.readline()
    with open(newName, 'w') as newFile:
        newFile.write(header)

        for line in File:
            if(line.isspace()): continue
            newFile.write(fmt(line))
    newFile.close()

#Break line into chunks, re format datetime, return as string
def fmt(line):
    line = line.split(',')
    line[1] = makeListFromDate(line[1])

    return makeString(line)

# 2015 09 01 09 39 00.000
def makeListFromDate(date):


    return str(date[:4] + '-' + \
    date[4:6] + '-' + \
    date[6:8] + ' ' + \
    date[8:10] + ':' + \
    date[10:12] + ':' + \
    date[12:14] )


# Joins list into string
def makeString(line):
    string = ''
    for item in line:
        string += item + ','
    return string[:-1]


if __name__ == '__main__':
    main()
