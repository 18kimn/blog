# An optional custom script to run before Hugo builds your site.
# You can delete it if you do not need it.

library(tidyverse)
imgs <- list.files("content", recursive =T, pattern = "png") %>%
  str_remove("portfolio/")
imgs <- paste0("../", imgs)
dirs <- str_extract(imgs, ".*/") %>% str_remove("/$")
imgs <- str_remove(imgs, ".*/")

series_vec <- str_remove(dirs, "\\.\\./") %>%
  str_remove("/.*") %>%
  map(function(dir){
    index <- paste0("content/portfolio/", dir) %>%
      list.files(pattern = "index", full.names=T) %>%
      readLines() %>%
      str_subset("title\\:") %>%
      str_remove("title\\:") %>%
      str_trim()
  }) %>%
  unlist()

series_locs <- dirs %>% str_extract(".*/")

caps <- str_remove(dirs, "\\.\\./") %>%
  map(function(dir){
    index <- paste0("content/portfolio/", dir) %>%
      list.files(pattern = "index", full.names=T) %>%
      readLines() %>%
      str_subset("title\\:") %>%
      str_remove("title\\:") %>%
      str_remove_all("\"") %>%
      str_trim()
  }) %>%
  unlist()

opts <- tibble(img = imgs, dir = dirs, cap = caps, series = series_vec, series_loc = series_locs)
make_item <- function(img, dir, cap, series, series_loc){
  paste("gallery_item:",
        paste0("- album: ", dir),
        paste0("\timage: ", img),
        paste0("\tcaption: <a href=",dir,">", cap, "</a>, from the <a href='", series_loc, "'>", series, "</a> series."  ),
        "\n",
        sep = "\n")
}

gallery_items <- paste(unlist(pmap(opts, make_item)), collapse = "")

assembled <- paste(
  "---",
  "title: Gallery",
  paste0("date: ", Sys.Date()),
  gallery_items,
  "---",
  "{{< gallery >}}",
  sep = "\n"
)
writeLines(assembled, "content/portfolio/gallery/index.md")
#didn't want to import another package so the syntax is messy especially here
  {{< gallery album="album/pics" >}}
