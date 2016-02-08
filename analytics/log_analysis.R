library(purrr)
library(dplyr)
library(lubridate)
library(jsonlite)
library(ggplot2)

data <- readr::read_lines('bunyan.log')

data_df <- data %>% map(function(dat) {dplyr::as_data_frame(fromJSON(dat))}) %>% bind_rows

data_df <- data_df %>% mutate(time = ymd_hms(time),
                              duration = as.numeric(time) - as.numeric(time[[1]]))
data_df %>% 
  mutate(querying = !grepl("starting on", msg)) %>%
  ggplot(aes(x = duration, y = factor(level))) + geom_point(aes(alpha = querying), size = 3) + theme_bw() +
  labs(y = "Banning Pulses", "time since first request (seconds)") +
  scale_alpha_discrete(name = "writing (30) or banned (40)")

data <- readr::read_lines('b2_bunyan.log')

data_df <- data %>% map(function(dat) {dplyr::as_data_frame(fromJSON(dat))}) %>% bind_rows

data_df <- data_df %>% mutate(time = ymd_hms(time),
                              duration = as.numeric(time) - as.numeric(time[[1]]))
data_df %>% 
  mutate(querying = !grepl("starting on", msg)) %>%
  ggplot(aes(x = duration, y = factor(level))) + geom_point(aes(alpha = querying), size = 3) + theme_bw() +
  labs(y = "Banning Pulses", "time since first request (seconds)")
str(data_df)