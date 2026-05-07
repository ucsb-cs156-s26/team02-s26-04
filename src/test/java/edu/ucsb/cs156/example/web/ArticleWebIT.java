package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_articles() throws Exception {
    setupUser(true);

    page.getByText("Articles").click();

    page.getByText("Create New Article").click();
    assertThat(page.getByText("Create New Articles")).isVisible();

    page.getByTestId("ArticlesForm-title").fill("Test Article");
    page.getByTestId("ArticlesForm-url").fill("https://dailynews.com");
    page.getByTestId("ArticlesForm-explanation").fill("This is a test article");
    page.getByTestId("ArticlesForm-email").fill("user@example.com");
    page.getByTestId("ArticlesForm-dateAdded").fill("2023-01-03T00:00:00");

    page.getByTestId("ArticlesForm-submit").click();

    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Test Article");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-url"))
        .hasText("https://dailynews.com");
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-explanation"))
        .hasText("This is a test article");
  }

  @Test
  public void regular_user_cannot_create_articles() throws Exception {
    setupUser(false);

    page.getByText("Articles").click();

    assertThat(page.getByText("Create Articles")).not().isVisible();
    assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
  }
}
