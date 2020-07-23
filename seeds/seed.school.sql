drop table if exists school_classes;

-- Create the table anew
create table school_classes (
  classId INTEGER primary key generated by default as identity,
  className text,
  startDate Date,
  finishDate Date,
  building text,
  room text,
  teacher text,
  startTime text,
  endTime text,
  Sun boolean,
  Mon boolean,
  Tue boolean,
  Wed boolean,
  Thurs boolean,
  Fri boolean,
  Sat boolean
);

drop table if exists homework_list;

CREATE TABLE homework_list (
  homeworkId INTEGER primary key generated by default as identity,,
            classId INTEGER REFERENCES school_classes(id) ON DELETE CASCADE NOT NULL,
            classDescription: text,
            schoolClass: text,
            classType: text,
            dueDate: Date,
            dueTime: text,
            priority: text
    
);