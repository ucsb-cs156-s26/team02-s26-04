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
public class UCSBDiningCommonsMenuItemWebIT extends WebTestCase {

  @Test
  public void admin_user_can_create_edit_delete_menuItem() throws Exception {
    setupUser(true);

    page.getByText("UCSBDiningCommonsMenuItem").click();

    page.getByText("Create UCSBDiningCommonsMenuItem").click();
    assertThat(page.getByText("Create New UCSBDiningCommonsMenuItem")).isVisible();

    page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Pesto Pasta");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Ortega");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Entree");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .hasText("Pesto Pasta");

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .hasText("Ortega");

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
        .hasText("Entree");

    page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Edit-button").click();

    assertThat(page.getByText("Edit UCSBDiningCommonsMenuItem")).isVisible();

    page.getByTestId("UCSBDiningCommonsMenuItemForm-name").fill("Salad");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode").fill("Portola");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-station").fill("Side");
    page.getByTestId("UCSBDiningCommonsMenuItemForm-submit").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .hasText("Salad");

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-diningCommonsCode"))
        .hasText("Portola");

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-station"))
        .hasText("Side");

    page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_menuItem() throws Exception {
    setupUser(false);

    page.getByText("UCSBDiningCommonsMenuItem").click();

    assertThat(page.getByText("Create UCSBDiningCommonsMenuItem")).not().isVisible();

    assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name"))
        .not()
        .isVisible();
  }
}
