# An optional custom script to run before Hugo builds your site.
# You can delete it if you do not need it.

#This script is a super messy, super hacky way of building the gallery page.
library(tidyverse)
imgs_og <- list.files("content", recursive =T, pattern = "png|gif") %>%
  str_remove("portfolio/")
imgs <- paste0("../", imgs_og)
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
      str_replace_all("\\:", "&colon;") %>%
      str_trim()
  }) %>%
  unlist()

opts <- tibble(img = imgs_og, dir = dirs, cap = caps, series = series_vec, series_loc = series_locs)
make_item <- function(img, dir, cap, series, series_loc){
  paste("- album: gallery",
        paste0("  image: https://github.com/18kimn/blog/raw/master/content/portfolio/", img),
        paste0("  caption: <a href=",dir,">", cap, "</a>, from the <a href='", series_loc, "'>", series, "</a> series."  ),
        "\n",
        sep = "\n")
}

gallery_items <- paste(unlist(pmap(opts, make_item)), collapse = "")

assembled <- paste(
  "---",
  "title: Gallery",
  paste0("date: ", Sys.Date()),
  "gallery_item:",
  gallery_items,
  "---\n\n",
  "{{< gallery >}}",
  sep = "\n"
)
writeLines(assembled, "content/portfolio/gallery/index.md")
